<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {name} {--resource}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new service class. Use the --resource option to generate a service with CRUD methods.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Split the name argument into path and class name components
        $parts = explode('/', $this->argument('name'));
        $className = array_pop($parts);

        // Append 'Service' suffix if it's not present
        if (!Str::endsWith($className, 'Service')) {
            $className .= 'Service';
        }

        // Construct the full path and namespace
        $path = implode('/', $parts);
        $fullPath = app_path('Services/' . $path);
        $namespace = 'App\\Services';
        if (!empty($path)) {
            $namespace .= '\\' . str_replace('/', '\\', $path);
        }


        // Ensure the directory exists
        if (!is_dir($fullPath)) {
            mkdir($fullPath, 0755, true);
        }

        $filePath = $fullPath . '/' . $className . '.php';

        // Check if the file already exists
        if (file_exists($filePath)) {
            $this->error('Service class already exists!');
            return 1;
        }

        // Define the content of the service file with the correct namespace and class name
        $content = "<?php\n\n";
        $content .= "namespace " . $namespace . ";\n\n";
        $content .= "class " . $className . "\n";
        $content .= "{\n";

        // Check if the --resource flag is present
        if ($this->option('resource')) {
            $content .= $this->getCrudMethods();
        } else {
            $content .= "    //\n";
        }
        $content .= "}\n";

        // Write the content to the file
        file_put_contents($filePath, $content);

        // Notify the user of the successful creation
        $this->info("Service class [" . $filePath . "] created successfully.");

        return 0;
    }


    /**
     * Get the boilerplate for the CRUD methods.
     *
     * @return string
     */
    protected function getCrudMethods()
    {
        return <<<EOT
    /**
     * Display a listing of the resource.
     */
    public function list(\$request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeData(\$request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function showData(\$id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateData(\$id, \$request)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteData(\$id)
    {
        //
    }
EOT;
    }
}
