class Storage {
  get dataKey() {

  }
  set(val) {
    window.localStorage.setItem(this.dataKey, JSON.stringify(val));
  }

  get() {
    try {
      return JSON.parse(window.localStorage.getItem(this.dataKey));
    } catch (e) {
      return null;
    }
  }
}

export class DataStorage extends Storage {
  get dataKey () {
    return 'notepad_data';
  }
}

export class CurrentNoteStorage extends Storage {
  get dataKey () {
    return 'notepad_current';
  }
}

export class SettingStorage extends Storage {
  get dataKey() {
    return 'notepad_setting';
  }
}

export function guid() {
  const chars = '1234567890abcdef';
  return [8, 4, 4, 4, 12].map(n => {
    let part = '';
    for (let i = 0; i < n; i++) {
      part += chars[Math.floor(Math.random() * 1000 * n) % chars.length]
    }
    return part;
  }).join('-');
}

export const now = (time) => {
  let date = time ? new Date(time) : new Date();
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let hour = String(date.getHours()).padStart(2, '0');
  let minute = String(date.getMinutes()).padStart(2, '0');
  let second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

