import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import { connect } from 'react-redux';

import { fetchStorageDocuments } from 'app/storage/redux/actions';
import guideSelector from 'app/documents/redux/selectors/guide';
import titleEntrySelector from 'app/catalog/redux/selectors/titleEntry';
import ctaDefaultsSelector from 'app/storage/redux/selectors/ctaDefaults';

import styles from './styles.scss';

export const CTA_NAMES = [
  'PreviewDocumentSectionCTA',
  'PreviewSectionFadeCTA',
  'BookCTA',
  'MiniCTA',
  'RVCEmailFixedCTA',
  'TRHEmailFixedCTA',
  'ModernWorkLibraryFixedCTA',
  'MWLEmailFixedCTA',
  'RWEmailFixedCTA',
  'HWCTA',
  'HWFixedCTA',
  'HWInlineCTA',
  'HWEmailCTA',
];

export const components = CTA_NAMES.reduce((ctaComponents, ctaName) => {
  return {
    ...ctaComponents,
    [ctaName]: loadable(() => import(`app/CTA/components/${ctaName}`)),
  };
}, {});

export const CTA = 'CTA';

const getStoragePath = id => `cta.${id}`;

class CTAEmbed extends PureComponent {
  componentDidMount() {
    const { id, config, fetchConfig } = this.props;
    if (id && !config) {
      fetchConfig();
    }
  }

  render() {
    const { name, id, footerCta, config, documentContext, bookMetadata, defaults } = this.props;
    const Component = components[name || config.ctaName];

    if (!Component) return null;
    if (id && !config) return null;

    const ctaProps = {
      ...config,
      defaults: config && config.defaults || defaults[name],
      footerCta,
      documentContext,
      guideMetadata: bookMetadata,
    };

    if (config && config.noContainer) {
      return <Component {...ctaProps} />;
    }

    return (
      <div className={styles.container}>
        <Component {...ctaProps} />
      </div>
    );
  }
}

CTAEmbed.propTypes = {
  name: PropTypes.oneOf(CTA_NAMES),
  id: PropTypes.string,
  footerCta: PropTypes.bool,
  documentContext: PropTypes.bool,
  guideSlug: PropTypes.string,

  bookMetadata: PropTypes.object,
  defaults: PropTypes.object,
  config: PropTypes.object,

  fetchConfig: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { id, name, config, guideSlug, bookMetadata, book: propsBook }) => {

  const book = propsBook || guideSlug && (titleEntrySelector(state, guideSlug) || guideSelector(state, guideSlug));
  return {
    bookMetadata: bookMetadata || (book && (book.bookMetadata || book.guideMetadata)),
    defaults: config && config.defaults || ctaDefaultsSelector(state),
    config: id ? state.storage[getStoragePath(id)] : config,
  };
};

const mapDispatchToProps = (dispatch, { id }) => ({
  fetchConfig: () => dispatch(fetchStorageDocuments(getStoragePath(id))),
});

export default connect(mapStateToProps, mapDispatchToProps)(CTAEmbed);
