/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('input', require('./input.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> input @root}}
		</hbs>`,
  {},
);
