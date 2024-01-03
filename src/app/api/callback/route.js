import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'

// Read PEM file
const pemContent = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAvPXwe9C+yxHHf+6v9GWNw6F5qGeOFA7xfgitX2heR8oohKtK
ojfmMAjL5CKmT9/N+9i5Bn0ZG2tEQewy6lU6KCsBtoCvol7v+TvpPpetVD5It8Sc
0qHTg4YiboBWnaeLia8wLXGJ4+h5ojfxfl7c404Hmg0HPynWgVO+9Q7Rotv2HHkG
WZRkBWKazwDJf8mwzJbCzKbNh5P7Y4g6J7ATBzslOzoskv12BXqxoY2q6vOrSM8T
ZVHupwDYpT0s0NeVjcgqVQdu1X+lAFG2kcLGpKyVia3wirW5kdwIMeGiCFZ0F574
zpKd94OKkTSuNwljOrx7wgCavUscIzyD/VkztQIDAQABAoIBAHxVy/Z8pX5TZZUt
hoPm6sAmGToRYbCbIJYQuZvEvfy47a5WU5an94P11ct4bTyzhANKWH0HhaTAETrb
Y6lDiS/zFH508JyDoZ26qUAxZ7C+BvU8nwAN0XKCqVdShSvZmfxv1OCiC9x2FMsD
ypifbPL4XhIkrncGXYndhBIVvSVOOpQqu9o+lrjRtktRDy1w++Ozk4PYxfHB9ZIk
MfkhpQvLt0hmSa7kV3fCDiemDdCHrWq0HoggUdwPj0C2pE149SF/NucW7q6/BVIF
U6YSfSNjBYzx9W6RCf+/6KI2W2f3tm0ROJhl1ytoV2Jri0V64Dho/lbooWotHjIP
jUkRfWECgYEA7u1W59hcnpAxVbTm5MXjHdzL63dKNXUe8OPJ6MVFuMLbvSm8/RwJ
iHjvf13KKkBuwRZJGNArJDRTzPYj3PdSX5f/fV2czOyZ8TKxY4JyQhSRIpZTkdUA
Tgf95/R3BC9tJDsoEpocEpozd4wKPrzvrVr0GMAhIv5c52M+FVzSUB0CgYEAynaS
Q/5yI6ZhOW/BxN4vA+R5f3JmwKy2Q3KDKPFpDSxIo7k9S9WLhTtrEw1j1UICj7Lw
TmSM23WwcICHEOLsF8IlZsoJ8ifKVzGHJMzZO/1nPykkA1gFmF3KJzt+O6rcdohs
ZMSA/sZQj/SUX890ZHKDnqbocqE0B2+AlQJCznkCgYA2sUnFhLee7G7+qYx5LftR
aKudWQ85sXfFuL8Nc6sEIkbexGEop3RfMx/Pzg5rIZi4xnsxHOXjQb81GdsXx92p
WEf50KYGGtsaZXpJxyCUk9StUDANH+8T7axnnoRoBts7AfeoWnK2p2nEod/ugJ10
128tAz4SnptxtDwP89GI2QKBgQCBNn9OybtKqUrvfzWpUSusTkqEXhzZ5uBD13eB
z+B9ub96TiSim1z54NwLQsZuOjysPUVEosOK5GeAxWZuDoUi/JMmMNd8JozqbP+V
Ku+Ra75S/wyu3aRkg6catstvhTJCq/qRrR+ueh68YRm4tAvSd4ss29UKI3uzKyRi
9Rhx8QKBgDcvFvyvIi6a7uZcAtzNTUguIzH6R+Atl0fCH2amyMGPyHSA8U4oE8kU
VugB3gwuCc79oZ3g8CTEXpXFtzD6Z/Q5jXF9rWFKO8CNN0u3b53YMpT8zKvJrMyi
g2DBvY/YzT8bPLaLPUjWrCNCurVOaG7N0v0AWkEcg2z6jDhVqQjU
-----END RSA PRIVATE KEY-----`

function genjwt(app_id=773836) {
    // Create payload
    const payload = {
        // Issued at time
        iat: Math.floor(Date.now() / 1000),
        // JWT expiration time (10 minutes maximum)
        exp: Math.floor(Date.now() / 1000) + 600,
        // GitHub App's identifier
        iss: app_id,
    };

    // Create JWT
    return jwt.sign(payload, pemContent, { algorithm: 'RS256' });
}


async function getAccessToken(installatinoID) {
    const url = `https://api.github.com/app/installations/${installatinoID}/access_tokens`
    const headers = {
        'Authorization': `Bearer ${genjwt()}`, 
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    }
    return fetch(url, {headers, method: 'POST'}).then(r => r.json());
}

export async function GET(request) {
    console.log(request.url);
    const { searchParams } = new URL(request.url);
    const access_tokens = await getAccessToken(searchParams.get('installation_id'))
    return NextResponse.json({
        code: searchParams.get('code'),
        installatinoID: searchParams.get('installation_id'),
        setupAction: searchParams.get('setup_action'),
        access_tokens,
    }, {status: 200});
}