/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('site-navigation', require('./site-navigation.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/site-navigation @root}}
		</hbs>`,
  require('./data'),
);
