// @ts-nocheck
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'

const label = 'database'

const options = [
  {
    value: '1',
    label: 'label1',
  },
  {
    value: '2',
    label: 'label2',
  },
]

const DatabaseSelect = () => {
  const router = useRouter()
  const [valueState, setValueState] = useState<string>('')

  const handleSelect = (e: SelectChangeEvent) => {
    const value = e.target.value
    setValueState(value)
    if (value) {
      router.push(`/database?name=${value}`)
    }
  }

  return (
    <FormControl
      sx={{
        minWidth: 400,
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={valueState}
        onChange={handleSelect}
        variant="outlined"
        placeholder="Please select"
        label={label}
      >
        <MenuItem value={''}>
          <em>None</em>
        </MenuItem>
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default DatabaseSelect
