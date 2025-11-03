export default function getTimeDifference(dateInput: string, isMobile: boolean = false): string {
    const createdDate = new Date(dateInput); // Converte a string em um objeto Date
    const currentDate = new Date();

    const differenceInSeconds = Math.floor((currentDate.getTime() - createdDate.getTime()) / 1000);

    let timeText = '';
    if (differenceInSeconds < 60) {
        timeText = `${differenceInSeconds} seg`;
    } else if (differenceInSeconds < 3600) {
        timeText = `${Math.floor(differenceInSeconds / 60)} min`;
    } else if (differenceInSeconds < 86400) {
        timeText = `${Math.floor(differenceInSeconds / 3600)} hrs`;
    } else {
        const days = Math.floor(differenceInSeconds / 86400);
        timeText = days === 1 ? `${days} dia` : `${days} dias`;
    }

    // Adiciona "atrás" apenas se não for mobile
    return isMobile ? timeText : `${timeText} atrás`;
}
