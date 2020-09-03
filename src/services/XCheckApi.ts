type Roles = 'author' | 'student' | 'supervisor' | 'course_manager';

type TScopeCategory = 'Basic Scope' | 'Extra Scope' | 'Fines';

type TSignInProps = {
  githubId: string;
  role: Roles;
};

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

type TRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type TCreateOptionsProps<T> = {
  method: TRequestMethod;
  data?: T;
};

type TCreatePostRequestProps<T> = {
  method: TRequestMethod;
  path: string;
  data?: T;
};

class XCheckApiService {
  constructor(private root = 'http://localhost:3004') {
    this.root = root;
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

  signIn = async (data: TSignInProps) =>
    this.createRequest({ method: 'POST', path: '/user', data });

  createTask = async (data: TTask) =>
    this.createRequest({ method: 'POST', path: '/tasks', data });
}

export default XCheckApiService;
