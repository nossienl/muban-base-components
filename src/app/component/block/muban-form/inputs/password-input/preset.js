/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('password-input', require('./password-input.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> password-input @root}}
		</hbs>`,
  {},
);
