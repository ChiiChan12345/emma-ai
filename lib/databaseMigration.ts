export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
}

export interface MigrationFile {
  id: string;
  version: string;
  name: string;
  description: string;
  up: string; // SQL for applying migration
  down: string; // SQL for rolling back migration
  timestamp: Date;
  checksum: string;
}

export interface MigrationStatus {
  id: string;
  version: string;
  name: string;
  appliedAt: Date;
  executionTime: number;
  status: 'pending' | 'applied' | 'failed' | 'rolled_back';
  error?: string;
}

export interface BackupConfig {
  includeData: boolean;
  includeSchema: boolean;
  tables?: string[];
  excludeTables?: string[];
  compress: boolean;
  format: 'sql' | 'custom' | 'tar';
}

export class DatabaseMigrationManager {
  private static instance: DatabaseMigrationManager;
  private config: DatabaseConfig;
  private migrations: Map<string, MigrationFile> = new Map();
  private migrationHistory: MigrationStatus[] = [];

  private constructor(config: DatabaseConfig) {
    this.config = config;
    this.initializeMigrations();
  }

  static getInstance(config?: DatabaseConfig): DatabaseMigrationManager {
    if (!DatabaseMigrationManager.instance) {
      if (!config) {
        throw new Error('Database configuration required for first initialization');
      }
      DatabaseMigrationManager.instance = new DatabaseMigrationManager(config);
    }
    return DatabaseMigrationManager.instance;
  }

  private initializeMigrations(): void {
    // Define migration files for Emma AI Customer Success Manager
    const migrations: MigrationFile[] = [
      {
        id: '001',
        version: '1.0.0',
        name: 'create_users_table',
        description: 'Create users table for authentication',
        up: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX idx_users_email ON users(email);
          CREATE INDEX idx_users_role ON users(role);
        `,
        down: `
          DROP TABLE IF EXISTS users CASCADE;
        `,
        timestamp: new Date('2024-01-01T00:00:00Z'),
        checksum: 'abc123'
      },
      {
        id: '002',
        version: '1.0.0',
        name: 'create_clients_table',
        description: 'Create clients table for customer management',
        up: `
          CREATE TABLE IF NOT EXISTS clients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            company VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'trial', 'churned')),
            health VARCHAR(50) DEFAULT 'healthy' CHECK (health IN ('healthy', 'at-risk', 'critical')),
            health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
            contract_value DECIMAL(12,2) DEFAULT 0,
            join_date DATE NOT NULL DEFAULT CURRENT_DATE,
            last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            next_renewal DATE,
            plan VARCHAR(100),
            notes TEXT,
            tags TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES users(id),
            updated_by UUID REFERENCES users(id)
          );
          
          CREATE INDEX idx_clients_email ON clients(email);
          CREATE INDEX idx_clients_status ON clients(status);
          CREATE INDEX idx_clients_health ON clients(health);
          CREATE INDEX idx_clients_company ON clients(company);
          CREATE INDEX idx_clients_contract_value ON clients(contract_value);
          CREATE INDEX idx_clients_join_date ON clients(join_date);
        `,
        down: `
          DROP TABLE IF EXISTS clients CASCADE;
        `,
        timestamp: new Date('2024-01-01T01:00:00Z'),
        checksum: 'def456'
      },
      {
        id: '003',
        version: '1.0.0',
        name: 'create_client_usage_table',
        description: 'Create client usage tracking table',
        up: `
          CREATE TABLE IF NOT EXISTS client_usage (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            metric_name VARCHAR(100) NOT NULL,
            metric_value DECIMAL(12,2) NOT NULL,
            metric_limit DECIMAL(12,2),
            usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
            recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX idx_client_usage_client_id ON client_usage(client_id);
          CREATE INDEX idx_client_usage_date ON client_usage(usage_date);
          CREATE INDEX idx_client_usage_metric ON client_usage(metric_name);
          CREATE UNIQUE INDEX idx_client_usage_unique ON client_usage(client_id, metric_name, usage_date);
        `,
        down: `
          DROP TABLE IF EXISTS client_usage CASCADE;
        `,
        timestamp: new Date('2024-01-01T02:00:00Z'),
        checksum: 'ghi789'
      },
      {
        id: '004',
        version: '1.0.0',
        name: 'create_communications_table',
        description: 'Create communications tracking table',
        up: `
          CREATE TABLE IF NOT EXISTS communications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'sms', 'call', 'meeting', 'note')),
            subject VARCHAR(500),
            content TEXT,
            status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'replied', 'failed')),
            direction VARCHAR(20) DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
            scheduled_at TIMESTAMP WITH TIME ZONE,
            sent_at TIMESTAMP WITH TIME ZONE,
            opened_at TIMESTAMP WITH TIME ZONE,
            replied_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES users(id),
            metadata JSONB
          );
          
          CREATE INDEX idx_communications_client_id ON communications(client_id);
          CREATE INDEX idx_communications_type ON communications(type);
          CREATE INDEX idx_communications_status ON communications(status);
          CREATE INDEX idx_communications_sent_at ON communications(sent_at);
          CREATE INDEX idx_communications_metadata ON communications USING GIN(metadata);
        `,
        down: `
          DROP TABLE IF EXISTS communications CASCADE;
        `,
        timestamp: new Date('2024-01-01T03:00:00Z'),
        checksum: 'jkl012'
      },
      {
        id: '005',
        version: '1.0.0',
        name: 'create_ai_analyses_table',
        description: 'Create AI analyses results table',
        up: `
          CREATE TABLE IF NOT EXISTS ai_analyses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            analysis_type VARCHAR(100) NOT NULL,
            input_data JSONB NOT NULL,
            results JSONB NOT NULL,
            confidence_score DECIMAL(5,4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
            model_version VARCHAR(50),
            processing_time INTEGER, -- milliseconds
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES users(id)
          );
          
          CREATE INDEX idx_ai_analyses_client_id ON ai_analyses(client_id);
          CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);
          CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at);
          CREATE INDEX idx_ai_analyses_confidence ON ai_analyses(confidence_score);
          CREATE INDEX idx_ai_analyses_input ON ai_analyses USING GIN(input_data);
          CREATE INDEX idx_ai_analyses_results ON ai_analyses USING GIN(results);
        `,
        down: `
          DROP TABLE IF EXISTS ai_analyses CASCADE;
        `,
        timestamp: new Date('2024-01-01T04:00:00Z'),
        checksum: 'mno345'
      },
      {
        id: '006',
        version: '1.0.0',
        name: 'create_automation_rules_table',
        description: 'Create automation rules table',
        up: `
          CREATE TABLE IF NOT EXISTS automation_rules (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            trigger_config JSONB NOT NULL,
            action_config JSONB NOT NULL,
            conditions JSONB,
            is_active BOOLEAN DEFAULT true,
            priority INTEGER DEFAULT 0,
            execution_count INTEGER DEFAULT 0,
            last_executed TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES users(id),
            updated_by UUID REFERENCES users(id)
          );
          
          CREATE INDEX idx_automation_rules_active ON automation_rules(is_active);
          CREATE INDEX idx_automation_rules_priority ON automation_rules(priority);
          CREATE INDEX idx_automation_rules_trigger ON automation_rules USING GIN(trigger_config);
          CREATE INDEX idx_automation_rules_action ON automation_rules USING GIN(action_config);
        `,
        down: `
          DROP TABLE IF EXISTS automation_rules CASCADE;
        `,
        timestamp: new Date('2024-01-01T05:00:00Z'),
        checksum: 'pqr678'
      },
      {
        id: '007',
        version: '1.0.0',
        name: 'create_integrations_table',
        description: 'Create third-party integrations table',
        up: `
          CREATE TABLE IF NOT EXISTS integrations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            provider VARCHAR(100) NOT NULL,
            type VARCHAR(50) NOT NULL CHECK (type IN ('crm', 'email', 'analytics', 'payment', 'communication')),
            status VARCHAR(50) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
            config JSONB NOT NULL,
            credentials JSONB, -- encrypted
            sync_frequency VARCHAR(50) DEFAULT 'hourly',
            last_sync TIMESTAMP WITH TIME ZONE,
            sync_status VARCHAR(50),
            error_message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES users(id)
          );
          
          CREATE INDEX idx_integrations_provider ON integrations(provider);
          CREATE INDEX idx_integrations_type ON integrations(type);
          CREATE INDEX idx_integrations_status ON integrations(status);
          CREATE INDEX idx_integrations_last_sync ON integrations(last_sync);
        `,
        down: `
          DROP TABLE IF EXISTS integrations CASCADE;
        `,
        timestamp: new Date('2024-01-01T06:00:00Z'),
        checksum: 'stu901'
      },
      {
        id: '008',
        version: '1.0.0',
        name: 'create_audit_log_table',
        description: 'Create audit log table for tracking changes',
        up: `
          CREATE TABLE IF NOT EXISTS audit_log (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            table_name VARCHAR(100) NOT NULL,
            record_id UUID NOT NULL,
            action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
            old_values JSONB,
            new_values JSONB,
            changed_by UUID REFERENCES users(id),
            changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ip_address INET,
            user_agent TEXT
          );
          
          CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
          CREATE INDEX idx_audit_log_record_id ON audit_log(record_id);
          CREATE INDEX idx_audit_log_action ON audit_log(action);
          CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);
          CREATE INDEX idx_audit_log_changed_by ON audit_log(changed_by);
        `,
        down: `
          DROP TABLE IF EXISTS audit_log CASCADE;
        `,
        timestamp: new Date('2024-01-01T07:00:00Z'),
        checksum: 'vwx234'
      },
      {
        id: '009',
        version: '1.1.0',
        name: 'add_performance_metrics_table',
        description: 'Add performance metrics tracking',
        up: `
          CREATE TABLE IF NOT EXISTS performance_metrics (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            metric_name VARCHAR(100) NOT NULL,
            metric_value DECIMAL(12,4) NOT NULL,
            metric_unit VARCHAR(20),
            context JSONB,
            recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
          CREATE INDEX idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);
          CREATE INDEX idx_performance_metrics_context ON performance_metrics USING GIN(context);
          
          -- Add performance tracking triggers
          CREATE OR REPLACE FUNCTION track_query_performance()
          RETURNS trigger AS $$
          BEGIN
            -- This would be implemented to track query performance
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `,
        down: `
          DROP FUNCTION IF EXISTS track_query_performance() CASCADE;
          DROP TABLE IF EXISTS performance_metrics CASCADE;
        `,
        timestamp: new Date('2024-01-15T00:00:00Z'),
        checksum: 'yzab567'
      },
      {
        id: '010',
        version: '1.1.0',
        name: 'add_client_health_history',
        description: 'Add client health score history tracking',
        up: `
          CREATE TABLE IF NOT EXISTS client_health_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
            health_status VARCHAR(50) NOT NULL CHECK (health_status IN ('healthy', 'at-risk', 'critical')),
            factors JSONB,
            calculated_by VARCHAR(50) DEFAULT 'system',
            recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX idx_client_health_history_client_id ON client_health_history(client_id);
          CREATE INDEX idx_client_health_history_recorded_at ON client_health_history(recorded_at);
          CREATE INDEX idx_client_health_history_score ON client_health_history(health_score);
          
          -- Create a view for latest health scores
          CREATE VIEW client_current_health AS
          SELECT DISTINCT ON (client_id) 
            client_id, 
            health_score, 
            health_status, 
            factors,
            recorded_at
          FROM client_health_history 
          ORDER BY client_id, recorded_at DESC;
        `,
        down: `
          DROP VIEW IF EXISTS client_current_health;
          DROP TABLE IF EXISTS client_health_history CASCADE;
        `,
        timestamp: new Date('2024-01-15T01:00:00Z'),
        checksum: 'cdef890'
      }
    ];

    migrations.forEach(migration => {
      this.migrations.set(migration.id, migration);
    });

    // Mock some migration history
    this.migrationHistory = [
      {
        id: '001',
        version: '1.0.0',
        name: 'create_users_table',
        appliedAt: new Date('2024-01-01T00:05:00Z'),
        executionTime: 1250,
        status: 'applied'
      },
      {
        id: '002',
        version: '1.0.0',
        name: 'create_clients_table',
        appliedAt: new Date('2024-01-01T01:05:00Z'),
        executionTime: 890,
        status: 'applied'
      }
    ];
  }

  // Migration Management
  getAllMigrations(): MigrationFile[] {
    return Array.from(this.migrations.values()).sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  getPendingMigrations(): MigrationFile[] {
    const appliedIds = new Set(this.migrationHistory.map(h => h.id));
    return this.getAllMigrations().filter(m => !appliedIds.has(m.id));
  }

  getMigrationHistory(): MigrationStatus[] {
    return [...this.migrationHistory].sort((a, b) => 
      b.appliedAt.getTime() - a.appliedAt.getTime()
    );
  }

  async applyMigration(migrationId: string): Promise<{ success: boolean; message: string; executionTime?: number }> {
    const migration = this.migrations.get(migrationId);
    if (!migration) {
      return { success: false, message: 'Migration not found' };
    }

    // Check if already applied
    const existing = this.migrationHistory.find(h => h.id === migrationId);
    if (existing && existing.status === 'applied') {
      return { success: false, message: 'Migration already applied' };
    }

    try {
      const startTime = Date.now();
      
      // Mock migration execution
      await this.executeSql(migration.up);
      
      const executionTime = Date.now() - startTime;
      
      // Record successful migration
      const status: MigrationStatus = {
        id: migration.id,
        version: migration.version,
        name: migration.name,
        appliedAt: new Date(),
        executionTime,
        status: 'applied'
      };
      
      // Update or add to history
      const existingIndex = this.migrationHistory.findIndex(h => h.id === migrationId);
      if (existingIndex >= 0) {
        this.migrationHistory[existingIndex] = status;
      } else {
        this.migrationHistory.push(status);
      }

      return { 
        success: true, 
        message: `Migration ${migration.name} applied successfully`,
        executionTime 
      };
    } catch (error) {
      // Record failed migration
      const status: MigrationStatus = {
        id: migration.id,
        version: migration.version,
        name: migration.name,
        appliedAt: new Date(),
        executionTime: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      const existingIndex = this.migrationHistory.findIndex(h => h.id === migrationId);
      if (existingIndex >= 0) {
        this.migrationHistory[existingIndex] = status;
      } else {
        this.migrationHistory.push(status);
      }

      return { 
        success: false, 
        message: `Migration ${migration.name} failed: ${status.error}` 
      };
    }
  }

  async rollbackMigration(migrationId: string): Promise<{ success: boolean; message: string }> {
    const migration = this.migrations.get(migrationId);
    if (!migration) {
      return { success: false, message: 'Migration not found' };
    }

    const existing = this.migrationHistory.find(h => h.id === migrationId);
    if (!existing || existing.status !== 'applied') {
      return { success: false, message: 'Migration not applied or already rolled back' };
    }

    try {
      // Execute rollback SQL
      await this.executeSql(migration.down);
      
      // Update status
      existing.status = 'rolled_back';

      return { 
        success: true, 
        message: `Migration ${migration.name} rolled back successfully` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async applyAllPending(): Promise<{ success: boolean; applied: number; failed: number; details: string[] }> {
    const pending = this.getPendingMigrations();
    let applied = 0;
    let failed = 0;
    const details: string[] = [];

    for (const migration of pending) {
      const result = await this.applyMigration(migration.id);
      if (result.success) {
        applied++;
        details.push(`✅ ${migration.name} (${result.executionTime}ms)`);
      } else {
        failed++;
        details.push(`❌ ${migration.name}: ${result.message}`);
      }
    }

    return {
      success: failed === 0,
      applied,
      failed,
      details
    };
  }

  private async executeSql(sql: string): Promise<void> {
    // Mock SQL execution - in real implementation, use database connection
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Database connection error');
    }
  }

  // Database Backup and Restore
  async createBackup(config: BackupConfig = {
    includeData: true,
    includeSchema: true,
    compress: true,
    format: 'custom'
  }): Promise<{ success: boolean; filename?: string; size?: number; message: string }> {
    try {
      // Mock backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `emma-ai-backup-${timestamp}.${config.format === 'custom' ? 'backup' : 'sql'}${config.compress ? '.gz' : ''}`;
      const size = Math.floor(Math.random() * 100) + 50; // 50-150 MB

      return {
        success: true,
        filename,
        size,
        message: `Backup created successfully: ${filename} (${size}MB)`
      };
    } catch (error) {
      return {
        success: false,
        message: `Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async restoreBackup(filename: string): Promise<{ success: boolean; message: string }> {
    try {
      // Mock restore process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      return {
        success: true,
        message: `Database restored successfully from ${filename}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Database Health and Statistics
  async getDatabaseStats(): Promise<{
    totalTables: number;
    totalRows: number;
    databaseSize: string;
    indexSize: string;
    connectionCount: number;
    slowQueries: number;
    cacheHitRatio: number;
  }> {
    // Mock database statistics
    return {
      totalTables: 12,
      totalRows: Math.floor(Math.random() * 100000) + 50000,
      databaseSize: `${Math.floor(Math.random() * 500) + 100}MB`,
      indexSize: `${Math.floor(Math.random() * 100) + 20}MB`,
      connectionCount: Math.floor(Math.random() * 20) + 5,
      slowQueries: Math.floor(Math.random() * 10),
      cacheHitRatio: Math.random() * 0.1 + 0.9 // 90-100%
    };
  }

  async optimizeDatabase(): Promise<{ success: boolean; message: string; optimizations: string[] }> {
    try {
      // Mock optimization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optimizations = [
        'Rebuilt 5 indexes',
        'Analyzed table statistics',
        'Cleaned up temporary files',
        'Optimized query cache',
        'Updated table statistics'
      ];

      return {
        success: true,
        message: 'Database optimization completed successfully',
        optimizations
      };
    } catch (error) {
      return {
        success: false,
        message: `Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        optimizations: []
      };
    }
  }

  // Connection Management
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Database connection successful' };
    } catch (error) {
      return { success: false, message: 'Connection failed' };
    }
  }

  updateConfig(newConfig: Partial<DatabaseConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): DatabaseConfig {
    return { ...this.config };
  }
}

export default DatabaseMigrationManager; 