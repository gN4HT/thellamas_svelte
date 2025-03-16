<?php

namespace Fruitcake\Cors;

use Closure;
use Fruitcake\Cors\CorsService;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Foundation\Http\Events\RequestHandled;
use Illuminate\Http\Request;
use Illuminate\Contracts\Container\Container;
use Symfony\Component\HttpFoundation\Response;


class HandleCors
{
    protected $cors;
    protected $container;

    public function __construct(CorsService $cors, Container $container)
    {
        $this->cors = $cors;
        $this->container = $container;
    }

    public function handle($request, Closure $next)
    {
        if (!$this->shouldRun($request)) {
            return $next($request);
        }

        if ($this->cors->isPreflightRequest($request)) {
            $response = $this->cors->handlePreflightRequest($request);
            return $this->addCorsHeaders($response);
        }

        $response = $next($request);
        return $this->addCorsHeaders($response);
    }

    protected function addCorsHeaders(Response $response): Response
    {
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        return $response;
    }

    protected function shouldRun(Request $request): bool
    {
        return $this->isMatchingPath($request);
    }

    protected function isMatchingPath(Request $request): bool
    {
        $paths = $this->getPathsByHost($request->getHost());

        foreach ($paths as $path) {
            if ($path !== '/') {
                $path = trim($path, '/');
            }

            if ($request->fullUrlIs($path) || $request->is($path)) {
                return true;
            }
        }

        return false;
    }

    protected function getPathsByHost(string $host)
    {
        $paths = $this->container['config']->get('cors.paths', []);
        return $paths[$host] ?? array_filter($paths, 'is_string');
    }
}
