/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('content', require('./content.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/content @root}}
		</hbs>`,
  require('./data'),
);
