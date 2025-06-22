import { useCallback, useEffect, useRef, useState } from 'react'

export const useAnimateState = ({
	open = false,
	handleClose
}: {
	open: boolean
	handleClose: (e?: any) => void
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [trigger, setTrigger] = useState(false)
	const timeOutTrigger = useRef(null)

	const createTrigger = (callBack: () => any, time = 300) => {
		clearTimeout(timeOutTrigger.current)
		timeOutTrigger.current = setTimeout(callBack, time)
	}
	useEffect(() => {
		if (!open) {
			setTrigger(false)
			createTrigger(() => {
				setIsOpen(false)
			}, 300)
		} else {
			setIsOpen(true)
			setTrigger(true)
		}
	}, [open])

	const triggerOpen = useCallback(() => {
		setIsOpen(true)
		createTrigger(() => {
			setTrigger(true)
		}, 100)
	}, [setIsOpen])

	const triggerClose = useCallback(() => {
		setTrigger(false)
		createTrigger(() => {
			setIsOpen(false)
			handleClose && handleClose()
		}, 300)
	}, [handleClose])
	return {
		isOpen,
		trigger,
		triggerOpen,
		triggerClose
	}
}
