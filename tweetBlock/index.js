import React from 'react';
import classnames from 'classnames';
import Icon from 'app/icons/components/Icon';
import TweeterUserName from 'app/social/components/TweeterUserName';
import TweeterTag from 'app/social/components/TweeterTag';
import Avatar from 'app/social/components/Avatar';

import styles from './styles.scss';

const isNameRegexp = /^@/;
const isTagRegexp = /^#/;

const TweetBlock = ({ className, quote }) => {
  const { content, user: { username, name, avatarImg } } = quote;
  const paragraphs = content.split(/\n/);

  return (
    <div className={classnames(className, styles.tweetWrapper)}>
      <div className={styles.tweetHeader}>

        <div className={styles.userInfo}>
          <Avatar imgSrc={avatarImg} className={styles.avatar} />
          <div>
            <div className={styles.name}>
              <TweeterUserName username={username} name={name} />
            </div>
            <div className={styles.twitterUsername}>
              <TweeterUserName username={username} />
            </div>
          </div>
        </div>

        <div className={styles.tweetLogo}>
          <Icon name="social-twitter" />
        </div>
      </div>

      <div className={styles.tweetContent}>
        {
          paragraphs.map((paragraph) => {
            if (!paragraph) return null
            return (
              <div key={`${username}-${paragraph.slice(0, 10)}`} className={styles.tweetParagraph}>
                {paragraph.split(/\s/).map((word, ind) => {
                  if (word.match(isNameRegexp)) return <TweeterUserName key={`${word}-${ind}`} username={word.replace(isNameRegexp, '')} />;
                  if (word.match(isTagRegexp)) return <TweeterTag key={`${word}-${ind}`} tag={word.replace(isTagRegexp, '')} />;
                  return <span key={`${word}-${ind}`}>{word}</span>;
                })}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default TweetBlock;
