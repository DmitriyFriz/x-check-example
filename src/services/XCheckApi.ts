type Roles = 'author' | 'student' | 'supervisor' | 'course_manager';

type TSignInProps = {
  githubId: string;
  role: Roles;
};

type TScopeCategory = 'Basic Scope' | 'Extra Scope' | 'Fines';

type TTask = {
  id: string;
  author: string;
  state: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoriesOrder: Array<TScopeCategory>;
  items: Array<{
    id: string;
    minScore: number;
    maxScore?: number;
    category?: TScopeCategory;
    title?: string;
    description?: string;
  }>;
};

type TCrossCheckState =
  | 'DRAFT'
  | 'REQUESTS_GATHERING'
  | 'CROSS_CHECK'
  | 'COMPLETED';

type TCrossCheckSession = {
  id: string;
  state: TCrossCheckState;
  taskId: string;
  coefficient: number;
  startDate: number;
  endDate: number;
  discardMinScore: boolean;
  discardMaxScore: boolean;
  minReviewsAmount: boolean;
  desiredReviewersAmount: boolean;
  attendees: Array<{
    githubId: string;
    reviewerOf: Array<string>;
  }>;
};

type TRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type TCreateOptionsProps<T> = {
  method: TRequestMethod;
  data?: T;
};

type TCreatePostRequestProps<T> = TCreateOptionsProps<T> & {
  path: string;
};

class XCheckApiService {
  constructor(
    private root = 'http://localhost:3004',
    private tasksUrl = 'tasks'
  ) {
    this.root = root;
    this.tasksUrl = tasksUrl;
  }

  private createOptions = <T>({ method, data }: TCreateOptionsProps<T>) => {
    const options = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: null as string | null,
    };

    if (data && (method === 'PUT' || method === 'POST')) {
      options.body = JSON.stringify(data);
    }

    return options;
  };

  private createRequest = async <T>({
    method,
    path,
    data,
  }: TCreatePostRequestProps<T>) => {
    const options = this.createOptions({ method, data });
    const request = await fetch(`${this.root}${path}`, options);
    const response = await request.json();
    console.log(response);

    return response;
  };

  private get = async (chunkPath: string) =>
    this.createRequest({ method: 'GET', path: `/${chunkPath}` });

  private getById = async (chunkPath: string, id: string) =>
    this.createRequest({ method: 'GET', path: `/${chunkPath}?id=${id}` });

  private create = async <T>(chunkPath: string, data: T) =>
    this.createRequest({ method: 'POST', path: `/${chunkPath}`, data });

  private update = async <T>(chunkPath: string, id: string, data: T) =>
    this.createRequest({
      method: 'PUT',
      path: `/${chunkPath}/${id}`,
      data,
    });

  private delete = async (chunkPath: string, id: string) =>
    this.createRequest({ method: 'DELETE', path: `/${chunkPath}/${id}` });

  signIn = async <T>(data: T) =>
    this.createRequest({ method: 'POST', path: '/user', data });

  tasks = {
    get: () => this.get(this.tasksUrl),
    getById: (id: string) => this.getById(this.tasksUrl, id),
    create: <T>(data: T) => this.create(this.tasksUrl, data),
    update: <T>(id: string, data: T) => this.update(this.tasksUrl, id, data),
    delete: (id: string) => this.delete(this.tasksUrl, id),
  };
}

export default XCheckApiService;
