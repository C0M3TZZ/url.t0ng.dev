import { writable } from 'svelte/store';

type AlertType = 'success' | 'error' | 'warning' | 'info';
type Alert = {
  id: string;
  type: AlertType;
  message: string;
};

export const alertStore = writable([] as Alert[]);

const trigger = (type: AlertType = 'info', message: string, duration: number) => {
	let id = Math.random().toString(36);
	alertStore.update((alerts) => {
		alerts.push({
			id,
			type,
			message
		});
		return alerts;
	});
	setTimeout(() => {
		alertStore.update((alerts) => {
			alerts = alerts.filter((alert) => alert.id !== id);
			return alerts;
		});
	}, duration);
};

export const success = (message: string, duration = 5000) => {
	trigger('success', message, duration);
};

export const error = (message: string, duration = 5000) => {
	trigger('error', message, duration);
};

export const warning = (message: string, duration = 5000) => {
	trigger('warning', message, duration);
};

export const info = (message: string, duration = 5000) => {
	trigger('info', message, duration);
};

export const clear = () => {
	alertStore.set([]);
};

export const subscribe = alertStore.subscribe;

export default {
	success,
	error,
	warning,
	info,
	clear,
	subscribe
};
