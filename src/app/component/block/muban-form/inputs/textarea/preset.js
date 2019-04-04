/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('textarea', require('./textarea.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> textarea @root}}
		</hbs>`,
  {},
);
