import json, boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('79010402-blog-posts')

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    post_id = event['pathParameters']['id']
    response = table.get_item(Key={'postId': post_id})
    if 'Item' not in response:
        return {'statusCode': 404, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': 'Not found'}
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(response['Item'], default=decimal_default)
    }