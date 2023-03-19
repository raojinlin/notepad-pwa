const fs = require('fs');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://raojinlin:fIajJdBqvQclBWOG@cluster0.2rqiglq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

export async function GET(request) {
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

  const db = client.db('notepad');
  await client.connect();
  let r = await db.collection('data').updateOne({id: body.id}, {$set: body}, {upsert: true});
  await client.close()
  return new Response(JSON.stringify(r));
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return new Response('Bad Request', {status: 400});
  }

  const db = client.db('notepad');
  await client.connect();
  let r = await db.collection('data').deleteOne({id: id});
  return new Response(JSON.stringify(r), {headers: {'content-type': 'application/json'}});
}
