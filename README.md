# local-notes
# Minimalist Note Taker

A clean and simple note-taking application with bi-directional linking and a command palette, built with ASP.NET Core and a local-first approach using SQLite. The front-end features a minimalist, light-themed design for a focused writing experience.

### Features

* **Clean and Minimalist UI:** A distraction-free, light-themed interface built for clarity and ease of use.

* **Create, Edit, and Delete Notes:** A full-featured editor for managing your notes.

* **Bi-directional Linking:** Use the `[[Note Title]]` syntax to create automatic links between notes. Linked notes display a "Linked From" section with backlinks.

* **Command Palette:** Quickly search and navigate to any note using a command palette accessible with `Ctrl+P` (or `Cmd+P` on Mac).

* **Local-First Data:** All notes are stored locally in a SQLite database, giving you full control over your data.

### Technologies Used

#### Backend

* **ASP.NET Core 8.0:** The web application framework for the API endpoints.

* **Entity Framework Core:** The ORM for handling database interactions.

* **SQLite:** A lightweight, local database engine for storing notes.

#### Frontend

* **HTML, CSS, JavaScript:** The core front-end technologies.

* **Bootstrap 5:** Used for a modern, responsive base layout.

### Getting Started

#### Prerequisites

* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

#### Running Locally

1.  **Clone the repository** to your local machine.

    ```
    git clone https://github.com/COMPILELINE/local-notes.git
    
    ```

2.  **Navigate** to the project directory.

    ```
    cd COMPILELINE/local-notes
    
    ```

3.  **Run the application** using the .NET CLI. This command will compile the project, run any database migrations, and start the web server.

    ```
    dotnet run
    
    ```

4.  Once the application is running, open your web browser and navigate to the URL provided in the console (e.g., `https://localhost:7001`).

*Note: If you are using the `index.html` file with the mock API, you can open it directly in your browser without the backend running. However, the full functionality relies on the ASP.NET Core API.*

### Project Structure

A brief overview of the key files and folders in the project:

```
/local-notes
├── Controllers/
│   └── NotesController.cs    # The API controller for handling notes
├── Models/
│   ├── AppDbContext.cs       # The Entity Framework Core database context
│   └── Note.cs               # The data model for a Note
├── wwwroot/
│   └── index.html            # The combined HTML, CSS, and JS for the minimalist UI
├── appsettings.json          # Configuration file for the database connection string
├── local-notes.csproj        # The project file with dependencies
└── Program.cs                # Application entry point and service configuration

```
