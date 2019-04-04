/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('email-input', require('./email-input.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> email-input @root}}
		</hbs>`,
  {},
);
