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
                    Navigate to the game page and select your desired mode of play.
                </PixelText>
                </vstack>
                <vstack gap="small">
                <PixelText size={2} >Step 2:</PixelText>
                <PixelText size={1.5}>
                    Use the controls to move, aim, and interact with the game elements. Familiarize yourself with the controls before starting the game.
                </PixelText>
                </vstack>
                <vstack gap="small">
                <PixelText size={2} >Step 3:</PixelText>
                <PixelText size={1.5}>
                    Compete to achieve the highest score by completing objectives or defeating opponents.
                </PixelText>
                </vstack>
                <vstack gap="small">
                <PixelText size={2} >Step 4:</PixelText>
                <PixelText size={1.5}>
                    Keep track of your performance on the leaderboard and aim to improve your rank with each attempt.
                </PixelText>
                </vstack>
                <vstack gap="small">
                <PixelText size={2} >Tips:</PixelText>
                <PixelText size={1.5}>
                    Stay focused, practice regularly, and watch out for updates or new features to enhance your gameplay experience.
                </PixelText>
                </vstack>
            </vstack>
        </vstack>
    </zstack>

   
  );
};
