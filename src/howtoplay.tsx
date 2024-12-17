import { Devvit } from '@devvit/public-api';
import { PixelText } from './PixelText.js';

export const HowToPlay = () => {
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
        <vstack gap="medium" alignment="middle center" padding="large" width="100%">
            <PixelText size={4}>How To Play</PixelText>
            <vstack width="90%" gap="medium" borderColor="white" border="thin" cornerRadius="medium" padding="medium">
                <vstack gap="small">
                <PixelText size={2} >Step 1:</PixelText>
                <PixelText size={1.5}>
                    Scratch the fog away with you mousbutton pressed to unhide the charcters before first timer runs out
                </PixelText>
                </vstack>
                <vstack gap="small">
                <PixelText size={2} >Step 2:</PixelText>
                <PixelText size={1.5}>
                    Piece together the remaining charcters with you mouse clicks before 2nd timer run out
                </PixelText>
                </vstack>
                <vstack gap="small">
                <PixelText size={1.5}>
                    Note: as you score higher game will get difficult!
                </PixelText>
                </vstack>
            </vstack>
        </vstack>
    </zstack>

   
  );
};
