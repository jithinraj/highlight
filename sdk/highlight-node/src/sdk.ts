import { IncomingHttpHeaders, request } from 'http'
import { Highlight } from '.'
import { NodeOptions } from './types.js'
import log from './log'

export const HIGHLIGHT_REQUEST_HEADER = 'x-highlight-request'

export interface HighlightInterface {
	init: (options: NodeOptions) => void
	isInitialized: () => boolean
	parseHeaders: (
		headers: IncomingHttpHeaders,
	) => { secureSessionId: string; requestId: string } | undefined
	consumeError: (
		error: Error,
		secureSessionId?: string,
		requestId?: string,
	) => void
	consumeEvent: (secureSessionId?: string) => void
	recordMetric: (
		secureSessionId: string,
		name: string,
		value: number,
		requestId?: string,
		tags?: { name: string; value: string }[],
	) => void
	flush: () => Promise<void>
	log: (...data: any[]) => void
}

let _debug: boolean = false
let highlight_obj: Highlight
export const H: HighlightInterface = {
	init: (options: NodeOptions) => {
		_debug = !!options.debug
		try {
			highlight_obj = new Highlight(options)
		} catch (e) {
			console.warn('highlight-node init error: ', e)
		}
	},
	isInitialized: () => !!highlight_obj,
	consumeError: (
		error: Error,
		secureSessionId?: string,
		requestId?: string,
	) => {
		try {
			highlight_obj.consumeCustomError(error, secureSessionId, requestId)
		} catch (e) {
			console.warn('highlight-node consumeError error: ', e)
		}
	},
	consumeEvent: (secureSessionId?: string) => {
		try {
			highlight_obj.consumeCustomEvent(secureSessionId)
		} catch (e) {
			console.warn('highlight-node consumeEvent error: ', e)
		}
	},
	recordMetric: (
		secureSessionId: string,
		name: string,
		value: number,
		requestId?: string,
		tags?: { name: string; value: string }[],
	) => {
		try {
			highlight_obj.recordMetric(
				secureSessionId,
				name,
				value,
				requestId,
				tags,
			)
		} catch (e) {
			console.warn('highlight-node recordMetric error: ', e)
		}
	},
	flush: async () => {
		try {
			await highlight_obj.flush()
		} catch (e) {
			console.warn('highlight-node flush error: ', e)
		}
	},
	parseHeaders: (
		headers: IncomingHttpHeaders,
	): { secureSessionId: string; requestId: string } | undefined => {
		try {
			if (headers && headers[HIGHLIGHT_REQUEST_HEADER]) {
				const [secureSessionId, requestId] =
					`${headers[HIGHLIGHT_REQUEST_HEADER]}`.split('/')
				return { secureSessionId, requestId }
			} else {
				H.log(
					`request headers do not contain ${HIGHLIGHT_REQUEST_HEADER}`,
				)
			}
		} catch (e) {
			console.warn('highlight-node parseHeaders error: ', e)
		}
		return undefined
	},
	log: (...data: any[]) => {
		if (_debug) {
			log('H', ...data)
		}
	},
}
