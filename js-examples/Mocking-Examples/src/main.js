// @flow
import { foo, bar, foobar } from './functions';

const main = () => `In main function: ${foo(2)} ${bar(3)} ${foobar(foo)}`;

export default main;
