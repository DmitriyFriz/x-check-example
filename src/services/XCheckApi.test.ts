import XCheckApiService from './XCheckApi';

const tasksData = [
  {
    id: 'some-task-v1',
    author: 'jack',
  },
  {
    id: 'some-task-v2',
    author: 'john',
  },
];

const fetchArgs = {
  url: '',
  options: {
    method: null,
    headers: null,
    body: null,
  },
};

describe('Requests', () => {
  global.fetch = jest.fn().mockImplementation((url, options) => {
    fetchArgs.url = url;
    fetchArgs.options = options;
    return { json: () => Promise.resolve(tasksData) };
  });

  const api = new XCheckApiService();

  it('should return data', async () => {
    const response = await api.tasks.get();
    expect(fetchArgs.options.method).toBe('GET');
    expect(response).toBe(tasksData);
  });

  it('should send request with id', async () => {
    const id = 'some-task-v2';
    await api.tasks.getById('some-task-v2');
    expect(fetchArgs.options.method).toBe('GET');
    expect(fetchArgs.url).toContain(`/tasks?id=${id}`);
  });

  it('should send request with body', async () => {
    const data = {
      id: 'some-task-v3',
      author: 'Frodo',
    };
    await api.tasks.create(data);
    expect(fetchArgs.options.method).toBe('POST');
    expect(fetchArgs.options.body).toBe(JSON.stringify(data));
  });
});
