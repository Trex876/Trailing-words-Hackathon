import { Devvit
 } from '@devvit/public-api';

import { PixelText } from './PixelText.js';

type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
};


  


export const LeaderBoard = () => {
    const entries: LeaderboardEntry[] = [
        { rank: 1, username: "AceGamer", score: 9500 },
        { rank: 2, username: "PixelPro", score: 8800 },
        { rank: 3, username: "CodeWizard", score: 7500 },
        { rank: 4, username: "GameChanger", score: 7200 },
        { rank: 5, username: "QuickDraw", score: 6900 },
        { rank: 6, username: "SharpShooter", score: 6700 },
        { rank: 7, username: "TacticMaster", score: 6400 },
        { rank: 8, username: "StealthNinja", score: 5900 },
        { rank: 9, username: "CyberKnight", score: 5500 },
        { rank: 10, username: "NightStalker", score: 5300 },
      ];

  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

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
      <PixelText size={4}>Leaderboard</PixelText>
      <vstack width="90%" gap="small" borderColor="white" border="thin" darkBorderColor='white' lightBorderColor='white' cornerRadius="medium" padding="small">
        <hstack border="thick" padding="small" gap="none" alignment="middle center">
          <vstack width="20%" alignment="middle center">
            <PixelText size={1.5}>Rank</PixelText>
          </vstack>
          <vstack width="50%" alignment="middle center">
            <PixelText size={1.5}>Username</PixelText>
          </vstack>
          <vstack width="30%" alignment="middle center">
            <PixelText size={1.5}>Score</PixelText>
          </vstack>
        </hstack>

        {sortedEntries.map((entry) => (
          <hstack key={entry.rank.toString()} padding="small" gap="none" alignment="middle center">
            <vstack width="20%" alignment="middle center">
              <PixelText size={1.2} >{entry.rank.toString()}</PixelText>
            </vstack>
            <vstack width="50%" alignment="middle center">
              <PixelText size={1.2}>{entry.username}</PixelText>
            </vstack>
            <vstack width="30%" alignment="middle center">
              <PixelText size={1.2}>{entry.score.toString()}</PixelText>
            </vstack>
          </hstack>
        ))}
      </vstack>
    </vstack>
      </zstack>
    
  );
};
