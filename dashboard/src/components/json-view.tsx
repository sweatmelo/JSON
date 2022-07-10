// @ts-nocheck
import dynamic from 'next/dynamic'
import type { ReactJsonViewProps } from 'react-json-view'

/**
 * There is a little bug
 *
 * https://github.com/mac-s-g/react-json-view/pull/374
 */

/**
 * @reference https://github.com/mac-s-g/react-json-view/issues/296
 */
const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false })

interface JSONViewProps extends ReactJsonViewProps { }

const JSONView: React.FC<JSONViewProps> = (props) => {
  return <DynamicReactJson displayDataTypes={false} {...props} />
}

export default JSONView
