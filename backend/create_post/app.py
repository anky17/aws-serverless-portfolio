import json, boto3, uuid, time

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('79010402-blog-posts')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    post = {
        'postId': str(uuid.uuid4()),
        'title': body['title'],
        'content': body['content'],
        'author': event['requestContext']['authorizer']['claims']['email'],
        'createdAt': int(time.time())
    }
    table.put_item(Item=post)
    return {
        'statusCode': 201,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(post)
    }