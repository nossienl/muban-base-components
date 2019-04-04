/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('muban-form', require('./muban-form.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> block/muban-form @root}}
		</hbs>`,
  require('./data'),
);
