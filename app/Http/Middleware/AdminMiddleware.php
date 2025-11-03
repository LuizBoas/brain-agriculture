<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Se a rota NÃO for admin, simplesmente deixa passar sem interferir
        if (!$request->is('admin/*')) {
            return $next($request);
        }

        // Por enquanto, permitir qualquer usuário logado acessar o admin
        // Depois pode adicionar verificação de role/permissão se necessário
        return $next($request);
    }
}


