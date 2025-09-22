# Terraform Cloud Setup Guide for RentPath

This guide will help you set up Terraform Cloud to manage your RentPath infrastructure state remotely.

## Prerequisites

1. **Terraform Cloud Account**: Sign up at [app.terraform.io](https://app.terraform.io)
2. **Terraform CLI**: Ensure you have Terraform CLI installed locally
3. **AWS Credentials**: Your AWS access key and secret key

## Step 1: Create Terraform Cloud Organization

1. Go to [app.terraform.io](https://app.terraform.io)
2. Sign up or log in
3. Create a new organization (e.g., `rentpath-org` or use your name)
4. Note down your organization name

## Step 2: Update Terraform Configuration

Update the organization name in `versions.tf`:

```hcl
terraform {
  cloud {
    organization = "your-actual-org-name"  # Replace with your organization name

    workspaces {
      name = "rentpath-production"
    }
  }
}
```

## Step 3: Create Workspace in Terraform Cloud

### Option A: Via Web UI
1. Go to your Terraform Cloud organization
2. Click "New workspace"
3. Choose "CLI-driven workflow"
4. Name: `rentpath-production`
5. Click "Create workspace"

### Option B: Via CLI (after login)
The workspace will be created automatically when you run `terraform init`

## Step 4: Configure AWS Credentials in Terraform Cloud

In your workspace settings:

1. Go to Variables tab
2. Add Environment Variables:
   - `AWS_ACCESS_KEY_ID` = your AWS access key (mark as sensitive)
   - `AWS_SECRET_ACCESS_KEY` = your AWS secret key (mark as sensitive)
   - `AWS_DEFAULT_REGION` = eu-central-1

## Step 5: Set Terraform Variables

Add these Terraform variables in the workspace (these will override terraform.tfvars):

### Required Variables:
- `project_name` = "rentpath"
- `environment` = "production"
- `aws_region` = "eu-central-1"
- `vpc_id` = "vpc-09e19cb5e3a2af527"
- `github_repo` = "your-username/RentPath"

### Array Variables (HCL format):
- `public_subnet_ids` = ["subnet-097bda305863980c9", "subnet-07b01bb4ef4b991f5", "subnet-047a4394eea7dd835"]
- `private_subnet_ids` = ["subnet-097bda305863980c9", "subnet-07b01bb4ef4b991f5", "subnet-047a4394eea7dd835"]

## Step 6: Local Setup and Authentication

1. **Login to Terraform Cloud:**
   ```bash
   terraform login
   ```
   This will open a browser window to generate an API token.

2. **Initialize Terraform:**
   ```bash
   cd infrastructure
   terraform init
   ```

3. **Plan your deployment:**
   ```bash
   terraform plan
   ```

4. **Apply (when ready):**
   ```bash
   terraform apply
   ```

## Step 7: Create Required AWS Secrets

Before running `terraform apply`, create the required secret in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name "rentpath-production/app-config" \
  --description "Laravel application configuration" \
  --secret-string '{
    "APP_KEY": "base64:your-generated-app-key-here",
    "APP_URL": "https://your-domain.com",
    "DB_USERNAME": "rentpath",
    "DB_PASSWORD": "your-secure-database-password",
    "DB_DATABASE": "rentpath"
  }'
```

## Step 8: Optional - GitHub Integration

For automated runs on git pushes:

1. In workspace settings, go to "Version Control"
2. Connect to your GitHub repository
3. Set working directory to `infrastructure/`
4. Enable automatic runs on pull requests

## Important Security Notes

1. **Never commit terraform.tfstate files to git**
2. **Store all sensitive values in Terraform Cloud variables marked as sensitive**
3. **Use AWS Secrets Manager for application secrets**
4. **Enable workspace locking to prevent concurrent runs**

## Workspace Settings Recommendations

- **Execution Mode**: Remote
- **Terraform Version**: Latest (1.6+)
- **Auto Apply**: Disable for production (manual approval required)
- **Speculative Plans**: Enable for pull requests

## Commands Reference

```bash
# Login to Terraform Cloud
terraform login

# Initialize with cloud backend
terraform init

# Plan changes
terraform plan

# Apply changes (will run in Terraform Cloud)
terraform apply

# Check workspace status
terraform workspace show

# Force unlock if stuck
terraform force-unlock LOCK_ID
```

## Troubleshooting

### Common Issues:

1. **Organization not found**: Check organization name in versions.tf
2. **Authentication failed**: Run `terraform login` again
3. **Workspace not found**: Create workspace in Terraform Cloud UI first
4. **AWS permissions**: Ensure AWS credentials are correctly set in workspace variables

### Support Resources:

- [Terraform Cloud Documentation](https://developer.hashicorp.com/terraform/cloud-docs)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)