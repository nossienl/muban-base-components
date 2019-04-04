/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('checkbox', require('./checkbox.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> checkbox @root}}
		</hbs>`,
  {},
);
