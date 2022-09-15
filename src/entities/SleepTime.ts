export class SleepTime {
	static async execute(time = 1000): Promise<void> {
		await new Promise<void>((resolve) =>
			setTimeout(() => resolve(), time)
		);
	}
}
