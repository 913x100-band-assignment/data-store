## Get Started

### Deploying:

```
sam deploy --guided
```

### Testing Websocket:

Prerequire

- NPM
- wscat

Connect to publish websocket by following command:   
```
$ wscat -c wss://{YOUR-API-ID}.execute-api.{YOUR-REGION}.amazonaws.com/{STAGE}
```
