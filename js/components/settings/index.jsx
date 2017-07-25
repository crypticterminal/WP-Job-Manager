/**
 * External dependencies
 */
import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { flowRight } from 'lodash';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import Main from 'components/main';
import Navigation from '../navigation';
import QuerySettings from '../data/query-settings';
import { saveSettings } from '../../state/settings/actions';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSettings, isFetchingSettings, isSavingSettings } from '../../state/settings/selectors';

class Settings extends Component {
	static propTypes = {
		children: PropTypes.element,
		initialValues: PropTypes.object,
		isFetching: PropTypes.bool,
		isSaving: PropTypes.bool,
		siteId: PropTypes.number,
		tab: PropTypes.string,
		translate: PropTypes.func,
	};

	onSubmit = data => this.props.saveSettings( this.props.siteId, data );

	render() {
		const {
			children,
			initialValues,
			isFetching,
			isSaving,
			siteId,
			tab,
			translate,
		} = this.props;
		const mainClassName = 'wp-job-manager__main';
		const isDisabled = isFetching || isSaving;

		return (
			<Main className={ mainClassName }>
				<QuerySettings siteId={ siteId } />
				<DocumentHead title={ translate( 'WP Job Manager' ) } />
				<Navigation activeTab={ tab } />
				{
					Children.map( children, child => cloneElement( child, {
						initialValues,
						isDisabled,
						isSaving,
						onSubmit: this.onSubmit,
					} ) )
				}
			</Main>
		);
	}
}

const connectComponent = connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );

		return {
			initialValues: getSettings( state, siteId ),
			isFetching: isFetchingSettings( state, siteId ),
			isSaving: isSavingSettings( state, siteId ),
			siteId,
		};
	},
	{ saveSettings }
);

export default flowRight(
	connectComponent,
	localize,
)( Settings );
