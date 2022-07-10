import { Fragment } from 'react'
import { CircularProgress, Box } from '@mui/material'

interface SpinProps {
  spin?: boolean
  children?: React.ReactNode
}

const Spin: React.FC<SpinProps> = ({ spin, children }) => {
  return (
    <Fragment>
      {spin ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </Fragment>
  )
}

export default Spin
