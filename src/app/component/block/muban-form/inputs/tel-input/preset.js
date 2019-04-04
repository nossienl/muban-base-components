/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('tel-input', require('./tel-input.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> tel-input @root}}
		</hbs>`,
  {},
);
