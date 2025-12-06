"use client"

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit, User, Shield } from "lucide-react";
import { DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data - dados fictícios para desenvolvimento
const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "SUPER" as const, status: "authorized" as const, createdAt: "08/09/2025" },
  { id: "2", name: "Manager User", email: "manager@example.com", role: "SUPER" as const, status: "authorized" as const, createdAt: "16/07/2025" },
  { id: "3", name: "Gestor User", email: "gestor@example.com", role: "GESTOR" as const, status: "authorized" as const, createdAt: "18/09/2025" },
  { id: "4", name: "Affiliate One", email: "affiliate1@example.com", role: "AFILIADO" as const, status: "authorized" as const, createdAt: "19/07/2025" },
  { id: "5", name: "Affiliate Two", email: "affiliate2@example.com", role: "AFILIADO" as const, status: "authorized" as const, createdAt: "19/07/2025" },
  { id: "6", name: "Affiliate Three", email: "affiliate3@example.com", role: "AFILIADO" as const, status: "authorized" as const, createdAt: "22/07/2025" },
  { id: "7", name: "Affiliate Four", email: "affiliate4@example.com", role: "AFILIADO" as const, status: "authorized" as const, createdAt: "19/07/2025" },
  { id: "8", name: "Affiliate Five", email: "affiliate5@example.com", role: "AFILIADO" as const, status: "authorized" as const, createdAt: "19/07/2025" },
];

export default function Settings() {
  const { toast } = useToast();
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });


  const roleColors: Record<string, string> = {
    SUPER: "bg-primary text-primary-foreground",
    GESTOR: "bg-amber-500/10 text-amber-500",
    AFILIADO: "bg-blue-500/10 text-blue-500",
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Configurações"
        subtitle="Gerencie usuários e preferências do sistema"
        showDatePicker={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
              <User className="w-4 h-4" />
              Usuários
            </TabsTrigger>
              <TabsTrigger value="security" className="gap-2" data-testid="tab-security">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Usuários do Sistema</h3>
                  <p className="text-sm text-muted-foreground">
                    Gerencie os usuários e suas permissões
                  </p>
                </div>
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-user">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-testid="modal-add-user">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                      <DialogDescription>Convide um novo usuário para o sistema</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" placeholder="Nome do usuário" data-testid="input-user-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@exemplo.com" data-testid="input-user-email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Cargo</Label>
                        <Select>
                          <SelectTrigger data-testid="select-user-role">
                            <SelectValue placeholder="Selecione o cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUPER">Super Admin</SelectItem>
                            <SelectItem value="GESTOR">Gestor</SelectItem>
                            <SelectItem value="AFILIADO">Afiliado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => {
                            setAddUserOpen(false);
                            toast({
                              title: "Usuário adicionado",
                              description: "O convite foi enviado por email.",
                            });
                          }}
                          data-testid="button-confirm-add-user"
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role]}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">
                          Autorizado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => {
                              setSelectedUser(user);
                              setEditForm({ name: user.name, email: user.email, role: user.role });
                              setEditUserOpen(true);
                            }}
                            data-testid={`button-edit-user-${user.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-red-500" data-testid={`button-delete-user-${user.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Configurações de Segurança</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" data-testid="input-current-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" data-testid="input-new-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" data-testid="input-confirm-password" />
                </div>
                <Button data-testid="button-change-password">
                  Alterar Senha
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
          <DialogContent data-testid="modal-edit-user">
            <DialogHeader className="pr-8">
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>Atualize as informações do usuário</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Nome do usuário"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  data-testid="input-edit-user-name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  placeholder="email@exemplo.com"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  data-testid="input-edit-user-email" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Cargo</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                  <SelectTrigger data-testid="select-edit-user-role">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER">Super Admin</SelectItem>
                    <SelectItem value="GESTOR">Gestor</SelectItem>
                    <SelectItem value="AFILIADO">Afiliado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditUserOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setEditUserOpen(false);
                    toast({
                      title: "Usuário atualizado",
                      description: "As informações foram salvas com sucesso.",
                    });
                  }}
                  data-testid="button-confirm-edit-user"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
