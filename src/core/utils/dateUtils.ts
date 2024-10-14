export const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }
    if (diffInMinutes < 1440) { // 24시간 이내
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}시간 전`;
    }
    // 24시간 이상 지났을 경우
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };