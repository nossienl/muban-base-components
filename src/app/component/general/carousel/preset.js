/* eslint-disable max-len */
import { storiesOf } from 'storybook/utils/utils';

storiesOf('carousel', require('./carousel.hbs')).add(
  'default',
  'No description yet...',
  `<hbs>
			{{> carousel @root}}
		</hbs>`,
  {},
);
