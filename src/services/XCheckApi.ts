type TRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type TCreateOptionsProps<T> = {
  method: TRequestMethod;
  data?: T;
};

type TCreateRequestProps<T> = TCreateOptionsProps<T> & {
  path: string;
};

class XCheckApiService {
  constructor(private root = 'http://localhost:3004') {
    this.root = root;
  }

  private urls = {
    tasks: 'tasks',
    crossChecks: 'cross-check-sessions',
    reviewRequests: 'review-requests',
    reviews: 'reviews',
  };

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

  private createRequest = async <T>({ method, path, data }: TCreateRequestProps<T>) => {
    const options = this.createOptions({ method, data });
    const request = await fetch(`${this.root}${path}`, options);
    const response = await request.json();

    return response;
  };

  private createDomainMethods = (url: string) => ({
    get: () => this.createRequest({ method: 'GET', path: `/${url}` }),

    getById: (id: string) => this.createRequest({ method: 'GET', path: `/${url}?id=${id}` }),

    getByFilter: (filter: string) =>
      this.createRequest({ method: 'GET', path: `/${url}?${filter}` }),

    create: <T>(data: T) => this.createRequest({ method: 'POST', path: `/${url}`, data }),

    updateById: <T>(id: string, data: T) =>
      this.createRequest({
        method: 'PUT',
        path: `/${url}/${id}`,
        data,
      }),

    delete: (id: string) => this.createRequest({ method: 'DELETE', path: `/${url}/${id}` }),
  });

  auth = {
    signIn: async <T>(data: T) => this.createRequest({ method: 'POST', path: '/user', data }),
  };

  tasks = this.createDomainMethods(this.urls.tasks);

  crossChecks = this.createDomainMethods(this.urls.crossChecks);

  reviewRequests = this.createDomainMethods(this.urls.reviewRequests);

  reviews = this.createDomainMethods(this.urls.reviews);
}

export default XCheckApiService;
