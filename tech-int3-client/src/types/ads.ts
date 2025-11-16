export type Category =
  | 'Электроника'
  | 'Недвижимость'
  | 'Транспорт'
  | 'Работа'
  | 'Услуги'
  | 'Животные'
  | 'Мода'
  | 'Детское';
export type Status = 'pending' | 'approved' | 'rejected' | 'draft';
type Priority = 'normal' | 'urgent';
type Состояние =
  | 'Новое'
  | 'Б/у'
  | 'Отличное'
  | 'Хорошее'
  | 'Удовлетворительное';
type Гарантия = 'Есть' | 'Нет' | 'Частичная';
type Цвет = 'Черный' | 'Белый' | 'Серый' | 'Синий' | 'Красный' | 'Зеленый';
export type Reason =
  | 'Запрещенный товар'
  | 'Неверная категория'
  | 'Некорректное описание'
  | 'Проблемы с фото'
  | 'Подозрение на мошенничество'
  | 'Другое'
  | null;
type Comment =
  | 'Объявление не соответствует правилам платформы'
  | 'Объявление прошло модерацию успешно';

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  categoryId: number;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  images: string[];
  seller: Seller;
  characteristics: Characteristics;
  moderationHistory: ModerationHistory[] | [];
}

interface Seller {
  id: number;
  name: string;
  rating: string;
  totalAds: number;
  registeredAt: string;
}

interface Characteristics {
  Состояние: Состояние;
  Гарантия: Гарантия;
  Производитель: string;
  Модель: string;
  Цвет: Цвет;
}

interface ModerationHistory {
  id: number;
  moderatorId: number;
  moderatorName: string;
  action: Status;
  reason: Reason;
  comment: Comment;
  timestamp: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface AdsResponse {
  ads: Ad[];
  pagination: Pagination;
}

export interface GetAdsParams {
  page?: number;
  limit?: number;
  status?: Status[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'priority' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
