const process = require('process');

const { MongoClient, ServerApiVersion } = require('mongodb');

function createClient() {
  return new MongoClient(
    process.env.MONGODB_URI || '', 
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      serverApi: ServerApiVersion.v1 
    }
  );
}

export async function GET(request) {
  const client = createClient();
  await client.connect();

  const data = await client.db('notepad').collection('data').find().toArray();

  await client.close()
  return new Response(JSON.stringify(data), {headers: {'content-type': 'application/json'}});
}

export async function POST(request, res) {
  const reader = request.body.getReader();
  let body = await reader.read().then(({ done, value }) => {
      return new TextDecoder().decode(value);
  });

  body = JSON.parse(body);

  const client = createClient();
  const db = client.db('notepad');
  await client.connect();
  delete body._id;
  let r = await db.collection('data').updateOne({id: body.id}, {$set: body}, {upsert: true});
  await client.close()
  return new Response(JSON.stringify(r));
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return new Response('Bad Request', {status: 400});
  }

  const client = createClient();
  const db = client.db('notepad');
  await client.connect();
  let r = await db.collection('data').deleteOne({id: id});
  await client.close();
  return new Response(JSON.stringify(r), {headers: {'content-type': 'application/json'}});
}
