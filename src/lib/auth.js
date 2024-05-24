import { eq, gt, and } from 'drizzle-orm';
import { db, UserTable, UserSession } from '../schema'
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import _ from 'loadsh';
import { encrypt } from './session';

export class UserNotFoundError extends Error {}

export class UserPasswordError extends Error {}

export class UserAlreadyExistsError extends Error {}

export default class Auth {
    async verify(email, password) {
        const user = await db
            .select({password: UserTable.password, name: UserTable.name, id: UserTable.id, email: UserTable.email})
            .from(UserTable)
            .where(eq(UserTable.email, email))
        if (!user || !user.length) {
            throw new UserNotFoundError('User not found')
        }

        if (await bcrypt.compare(password, user[0].password)) {
            return _.omit(user[0], 'password');
        }

        return null;
    }

    async login(email, password) {
        const user = await this.verify(email, password);
        if (!user) {
            throw new UserPasswordError('User not found')
        }

        const expiredAt = dayjs().add(24, 'hour').$d
        const sessionPayload = {userID: user.id, expiredAt};
        const sessionKey = await encrypt(sessionPayload);
        sessionKey.toString();
        const session = await db
            .insert(UserSession)
            .values({userID: user.id, key: sessionKey, expiredAt, data: sessionPayload, createdAt: new Date()})
            .onConflictDoUpdate({target: UserSession.userID, set: {key: sessionKey, expiredAt, data: sessionPayload}})
            .returning();

        return session[0];
    }

    async logout(userID, authID) {
        await db.delete(UserSession).where(and(eq(UserSession.userID, userID), eq(UserSession.key, authID)));
    }

    async getLoginUser(authID) {
        const session = await db.select({userID: UserSession.userID})
            .from(UserSession)
            .where(and(eq(UserSession.key, authID), gt(UserSession.expiredAt, new Date())));

        if (!session || !session.length) {
            return 0;
        }

        return session.userID;
    }

    async register(name, email, password) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        try {
            return await db.insert(UserTable).values({name, email, password, image: ''}).returning();
        } catch (err) {
            if (err.message.includes('duplicate key value violates unique constraint ')) {
                throw new UserAlreadyExistsError(err.message);
            }

            throw err;
        }
    }
}
