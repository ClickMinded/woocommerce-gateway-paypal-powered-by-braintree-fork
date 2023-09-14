<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInitd4d2bb9feb0804dbfac1901f71d4ea4a
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        require __DIR__ . '/platform_check.php';

        spl_autoload_register(array('ComposerAutoloaderInitd4d2bb9feb0804dbfac1901f71d4ea4a', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInitd4d2bb9feb0804dbfac1901f71d4ea4a', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInitd4d2bb9feb0804dbfac1901f71d4ea4a::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}
