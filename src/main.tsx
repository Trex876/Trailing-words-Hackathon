import './createPost.js';

import { Devvit, useState } from '@devvit/public-api';
import { PixelText } from './PixelText.js';
import { LeaderBoard } from './table.js';
import { HowToPlay } from './howtoplay.js';

type WebViewMessage =
  | {
      type: 'initialData';
      data: { username: string; currentCounter: number };
    }
  | {
      type: 'setCounter';
      data: { newCounter: number };
    }
  | {
      type: 'updateCounter';
      data: { currentCounter: number };
    };

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Webview Example',
  height: 'tall',
  render: (context) => {
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    const [counter, setCounter] = useState(async () => {
      const redisCount = await context.redis.get(`counter_${context.postId}`);
      return Number(redisCount ?? 0);
    });

    const [showTable, setShowTable] = useState(false);
    const [showHow, setShowHow] = useState(false);
    const [webviewVisible, setWebviewVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
      setIsPressed(true);
      onShowWebviewClick();
      setTimeout(() => {
        setIsPressed(false);
      }, 1000);
    };

    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case 'setCounter':
          await context.redis.set(`counter_${context.postId}`, msg.data.newCounter.toString());
          context.ui.webView.postMessage('myWebView', {
            type: 'updateCounter',
            data: {
              currentCounter: msg.data.newCounter,
            },
          });
          setCounter(msg.data.newCounter);
          break;
        case 'initialData':
        case 'updateCounter':
          break;

        default:
          throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
    };

    const onShowWebviewClick = () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage('myWebView', {
        type: 'initialData',
        data: {
          username: username,
          currentCounter: counter,
        },
      });
    };

    if(webviewVisible){
      return(
        <vstack grow={webviewVisible} height={'100%'}>
          <vstack border="thick" borderColor="black" height={'100%'}>
            <webview
              id="myWebView"
              url="page.html"
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
              grow
              height={'100%'}
            />
          </vstack>
        </vstack>
      )
    }

    if(showTable) return <LeaderBoard />
    if(showHow) return <HowToPlay setHowtoPlay={setShowHow}/>
    return (
      <zstack >
          <image
            imageHeight={1024}
            imageWidth={1500}
            height="100%"
            width="100%"
            url='stars2.gif'
            description="striped blue background"
            resizeMode="cover"
          />
          <vstack grow padding="large"  alignment='top center'  height={"100%"}  width={"100%"} >
            <spacer/>
            <spacer/>
            <spacer/>
            <spacer/>
            <vstack width='100%' alignment='middle center' gap='none' padding='large'>
              <PixelText size={6}>BlindGuess</PixelText>
            </vstack>
            <spacer/>
            <spacer/>
            <spacer/>
            <spacer/>
            <vstack
              grow={!webviewVisible}
              gap={"small"}
              alignment="bottom center"
              width={"100%"}
            > 
            <vstack
              padding="small"
              border={isPressed ? 'thick' : 'thin'}
              borderColor={isPressed ? 'blue' : 'white'} 
              width={"200px"}
              alignment="center"
              onPress={handlePress}
            >
              <PixelText size={1.5}>Start</PixelText>
            </vstack>
              <spacer />
              <vstack padding='small' border='thin' borderColor='white' width={"200px"} alignment='center' onPress={() => setShowHow(true)}>
              <PixelText size={1.5}>How to Play</PixelText>
              </vstack>
              <spacer/>
            
            </vstack>
        </vstack>
      </zstack>
    );
  },
});

export default Devvit;
