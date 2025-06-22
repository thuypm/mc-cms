import { Dispatch, ReactNode, SetStateAction } from 'react'
import { Overlay } from 'ol'
import { Options } from 'ol/Overlay'

interface MLPopUpOverlayOptiosn extends Options {
	setSelectedDoc?: Dispatch<SetStateAction<any>>
}
export class MLPopUpOverlay extends Overlay {
	className?: string
	title?: ReactNode
	content?: ReactNode

	setSelectedDoc?: Dispatch<SetStateAction<any>>

	constructor(options: MLPopUpOverlayOptiosn) {
		super(options)
		this.setSelectedDoc = options.setSelectedDoc
	}
}

export interface MapConfig {}
