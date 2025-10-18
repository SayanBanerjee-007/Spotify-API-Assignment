class StateStore {
	constructor(ttl = 10 * 60 * 1000) {
		this.store = new Map()
		this.ttl = ttl
	}

	set(state, metadata = {}) {
		this.store.set(state, {
			createdAt: Date.now(),
			expiresAt: Date.now() + this.ttl,
			...metadata,
		})

		setTimeout(() => this.store.delete(state), this.ttl)
	}

	has(state) {
		const data = this.store.get(state)

		if (!data) {
			return false
		}

		if (Date.now() > data.expiresAt) {
			this.store.delete(state)
			return false
		}

		return true
	}

	get(state) {
		if (!this.has(state)) {
			return null
		}
		return this.store.get(state)
	}

	delete(state) {
		this.store.delete(state)
	}

	size() {
		return this.store.size
	}

	clear() {
		this.store.clear()
	}
}

export const stateStore = new StateStore()
