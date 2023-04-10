import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import loadable from '@loadable/component';
import guideReviewsSelector from 'app/storage/redux/selectors/guideReviews';

import getConfigType from './configPropType';
import { TWEET, REVIEW, CHAT_BUBBLE } from './constants';

import styles from './styles.scss';

const ReviewBlock = loadable(() => import('app/social/components/ReviewBlock'));
const TweetBlock = loadable(() => import('app/social/components/TweetBlock'));
const ChatBubbleBlock = loadable(() => import('app/social/components/ChatBubbleBlock'));

const getColumnsClassName = (quotesCount) => {
  if (quotesCount < 3) return styles.columnsCount1;
  if (quotesCount < 6) return styles.columnsCount2;
  return styles.columnsCountDefault;
};

const convertGuideReviews = (reviews) => {
  if (!reviews.length) return [];

  return (
    reviews.sort((a, b) => a.order < b.order ? -1 : 1).map((review) => ({
      user: { name: review.author, headline: review.company },
      content: review.text,
      type: REVIEW,
    }))
  )
}

const BlockQuotes = ({ book, config, guideReviews, defaultReviewsTitle, wrap: BlockWrap }) => {
  if (!config) return null;

  const { quotes, title, subtitle } = config;
  const quotesFromReviews = guideReviews ? convertGuideReviews(Object.values(guideReviews)) : [];
  const formedQuotes = quotes ? quotes.concat(quotesFromReviews) : quotesFromReviews;

  if (!formedQuotes.length) return null;

  return (
    <BlockWrap
      style={config.style}
      className={styles.container}
      maxWidthBlockClassName={styles.maxWidthContainer}
      colorContextSlug={book ? (book.guideMetadata || book.bookMetadata).slug : null}
    >
      <h1>{title || (!quotes && defaultReviewsTitle)}</h1>
      {subtitle && <h4>{subtitle}</h4>}
      <div className={classnames(getColumnsClassName(formedQuotes.length), styles.quotesContainer)}>
        {formedQuotes.map((quote) => {
          if (quote.type === TWEET) return <TweetBlock className={styles.item} key={quote.content} quote={quote} />;
          if (quote.type === CHAT_BUBBLE) return <ChatBubbleBlock className={styles.item} key={quote.content} quote={quote} />;
          return <ReviewBlock className={styles.item} key={quote.content} quote={quote} />;
        })}
      </div>
    </BlockWrap>
  );
};

BlockQuotes.defaultProps = {
  defaultReviewsTitle: 'Reviews',
};

BlockQuotes.propTypes = {
  config: getConfigType(PropTypes),
  defaultReviewsTitle: PropTypes.string,
  guideReviews: PropTypes.object,
};

const mapStateToProps = (state, { config: { contextDocument } }) => {
  return {
    guideReviews: contextDocument ? guideReviewsSelector(state, contextDocument.documentSlug) : null,
  };
};

export default connect(mapStateToProps)(BlockQuotes);
