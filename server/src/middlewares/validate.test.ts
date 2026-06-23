import { describe, it, expect, vi } from 'vitest';
import { validate } from './validate.js';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

describe('validate middleware', () => {
  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as Response;
  };

  it('should pass validation for valid data', () => {
    const schema = z.object({ name: z.string() });
    const middleware = validate({ body: schema });

    const req = { body: { name: 'Test' } } as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // No arguments means success
    expect(req.body).toEqual({ name: 'Test' });
  });

  it('should fail validation and return 400 for invalid data', () => {
    const schema = z.object({ name: z.string() });
    const middleware = validate({ body: schema });

    const req = { body: { name: 123 } } as Request; // Invalid type
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Validation Error'
    }));
  });

  it('should validate query and params', () => {
    const querySchema = z.object({ limit: z.string() });
    const paramsSchema = z.object({ id: z.string() });
    
    const middleware = validate({ query: querySchema, params: paramsSchema });

    const req = { 
      query: { limit: '10' },
      params: { id: 'abc' }
    } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
