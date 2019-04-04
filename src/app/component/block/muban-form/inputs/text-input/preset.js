/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('text-input', require('./text-input.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> text-input @root}}
		</hbs>`,
  {},
);
