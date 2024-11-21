{/* Previous imports remain the same */}

export default function NotesPage() {
  const [notes, setNotes] = React.useState<Note[]>([])
  const [categories, setCategories] = React.useState<Category[]>([
    { 
      id: "1", 
      name: "Roteiros", 
      color: "#2563eb", // Blue
      backgroundColor: "#eff6ff"  // Light blue background
    },
    { 
      id: "2", 
      name: "Prompts", 
      color: "#0891b2", // Cyan
      backgroundColor: "#ecfeff" // Light cyan background
    },
    { 
      id: "3", 
      name: "Outros", 
      color: "#4f46e5", // Indigo
      backgroundColor: "#eef2ff" // Light indigo background
    },
  ])

  // ... other state and handlers remain the same ...

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          {/* Header remains the same */}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl p-6"
                style={{ backgroundColor: category.backgroundColor }}
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg"
                      style={{ backgroundColor: category.color }}
                    />
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddNote(category.name)}
                      className="hover:bg-white/50 text-blue-600"
                      disabled={notes.filter((note) => note.category === category.name).length >= 5}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedCategory(category)
                        setIsCategoryDialogOpen(true)
                      }}
                      className="hover:bg-white/50 text-blue-600"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Notes list */}
                <AnimatePresence>
                  {notes
                    .filter((note) => note.category === category.name)
                    .map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="group relative mb-4 last:mb-0"
                      >
                        <Card
                          className="cursor-pointer bg-white hover:border-blue-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                          onClick={() => {
                            setSelectedNote(note)
                            setIsNoteDialogOpen(true)
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{note.title}</h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 h-8 w-8 hover:bg-gray-50 text-blue-600"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDuplicateNote(note)
                                    }}
                                    className="gap-2"
                                  >
                                    <Copy className="h-4 w-4" />
                                    Duplicar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteNote(note.id)
                                    }}
                                    className="text-red-600 gap-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="line-clamp-3 text-sm text-gray-500">{note.content}</p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty state */}
                {notes.filter((note) => note.category === category.name).length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-8 text-center bg-white/50 rounded-xl"
                  >
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Nenhuma nota criada</p>
                    <Button
                      variant="link"
                      onClick={() => handleAddNote(category.name)}
                      className="mt-2 text-blue-600"
                    >
                      Criar primeira nota
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Dialogs remain the same */}
        </div>
      </div>
    </div>
  )
}