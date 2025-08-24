import dayjs from 'dayjs'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
export default function Header({ startCamera, stopCamera }) {
  const { filterLocation, setFilterLocation, dataJSON } = {
    filterLocation: '',
    setFilterLocation: (loc) => {},
    dataJSON: [],
  }
  const uniqueLocations = useMemo(() => {
    const uniqueLocations = [...new Set(dataJSON.map((item) => item.location))]
    return uniqueLocations
  }, [dataJSON])

  const [isStartCamera, setIsStartCamera] = useState(false)
  return (
    <div className="flex justify-between align-items-center px-2">
      <h2 className="text-xl font-bold text-center">
        <Link to={'/'}>{dayjs().format('ddd, DD-MM-YY')}</Link>
      </h2>
      <div className="p-2 flex justify-content-center">
        <Button
          onClick={() => {
            if (!isStartCamera) {
              startCamera()
              setIsStartCamera(true)
            } else {
              stopCamera()
              setIsStartCamera(false)
            }
          }}
        >
          {!isStartCamera ? 'Bật camera' : 'Tắt camera'}
        </Button>
      </div>
      <div className="flex-1">
        <Dropdown
          className="w-full"
          options={uniqueLocations.map((e) => ({
            label: e,
            value: e,
          }))}
          value={filterLocation}
          onChange={(e) => {
            setFilterLocation(e.target.value)
          }}
        ></Dropdown>
      </div>
    </div>
  )
}
